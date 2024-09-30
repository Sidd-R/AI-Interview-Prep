from flask import Flask, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
torch.random.manual_seed(0)
from utils.pdfread import pdf_read
import ast

app = Flask(__name__)

# Initialize the pipeline
model = AutoModelForCausalLM.from_pretrained(
    "microsoft/Phi-3.5-mini-instruct",
    device_map="cuda",
    torch_dtype="auto",
    trust_remote_code=True,
    low_cpu_mem_usage=True,
)
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3.5-mini-instruct")

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
)

generation_args = {
    "max_new_tokens": 500,
    "return_full_text": False,
    "temperature": None,
    "do_sample": False,
}

def assess_candidate_response(question, answer):
    assessment = [
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": f"""
        Question:
        {question}

        Candidate Response:
        {answer}

        You have to assess the candidate response and rate them from 1 to 5 in terms of grammar, answer relevancy, and fluency.
        Format the answer in list [grammar_score, relevancy_score, fluency_score] and just return the list, no explanation needed.
        """.strip()}
    ]

    output = pipe(assessment, **generation_args)
    assess_result = output[0]['generated_text'].strip()
    
    # Attempt to parse the string as a Python list
    try:
        scores = ast.literal_eval(assess_result)
        if isinstance(scores, list) and len(scores) == 3 and all(isinstance(score, int) for score in scores):
            return scores
    except:
        pass
    
    # If parsing fails or the result is not in the expected format, return a default score
    return [3, 3, 3]  # Default moderate scores

def generate_interview_question(resume_text):
    start_question = [
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": f"""
        {resume_text}

        You have the candidate resume above. Ask one short technical question which gives a good start to the interview process.
        Format of the output has to be just one question, no explanation needed.
        """.strip()}
    ]

    output = pipe(start_question, **generation_args)
    return output[0]['generated_text'].strip()

def generate_continuation_question(previous_question, candidate_answer):
    continue_question = [
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": f"""
        {previous_question}

        Candidate response:
        {candidate_answer}

        You have to ask a short continue question based on the candidate response.
        Format of output would be just one new question.
        """.strip()}
    ]

    output = pipe(continue_question, **generation_args)
    return output[0]['generated_text'].strip()

previous_question = ""

@app.route('/interview_question', methods=['GET'])
def interview():
    # data = request.json
    # resume_text = data.get('resume', '')
    resume_text = pdf_read()
    
    if not resume_text:
        return jsonify({"error": "Resume text is required"}), 400

    question = generate_interview_question(resume_text)
    previous_question = question
    return jsonify({"question": question})


@app.route('/new_question', methods=['GET'])
def new_question():
    answer = "I am poor"
    continuation_question = generate_continuation_question(previous_question, answer)
    return jsonify({"question": continuation_question})

@app.route('/assess_question', methods=['GET'])
def assess():
    question = previous_question
    candidate_answer = "I am poor"
    assessment_scores = assess_candidate_response(question, candidate_answer)
    return jsonify({
        "grammar_score": assessment_scores[0],
        "relevancy_score": assessment_scores[1],
        "fluency_score": assessment_scores[2]
    })

if __name__ == '__main__':
    app.run(debug=True)