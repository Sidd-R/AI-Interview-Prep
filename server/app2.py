from flask import Flask, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
torch.random.manual_seed(0)
from utils.pdfread import pdf_read
import ast
import multiprocessing

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

def generate_hr_question():
    hr_questions = ["Why do you want to work for our company?", "What are your greatest strengths and weaknesses?", "How would you rate yourself on a scale of 1 to 10?", "Where do you see yourself in 5 years?", "Why should we hire you?"]
    sample_answers = ["I feel that with my current skill sets and my experience in the XYZ domain, the job requirements this role presented are a perfect match for me. I could visualize myself in that role as it aligned with my career aspirations, skills, and expertise. Besides, I have researched your company and found that it has impressive and promising projections which made me excited to be a part of the amazing future. I would take pride in working under the great leadership of this company and I found this place to be a perfect fit for utilizing my expertise along with the promising aspect of personal growth.", 
                  "I think one of my greatest strengths is that I am a great team player. I am also a self-motivated and quick learning individual. Whatever task that I set to do, I always give my best and complete it diligently well in advance. My weakness would be that I am learning to master people skills while meeting new individuals. I get nervous while talking to new people. I have been working on this for quite a long time and I can say with utmost confidence that I have come a long way.", \
                  "I would like to rate myself an 8. 8 because I know that I am not perfect and there is always a scope for learning and improvement. Continuous learning is the most fundamental part of personal and professional growth.", 
                  "Over 5 years, I would love to utilize all the opportunities that this company provides me to learn by utilizing the internal and external training programs. My ultimate career goal is to become a Technology Architect and hence I would look forward to developing various products that represent the vision of this company and be a part of making a difference along with quickening my journey of becoming a Tech Architect.", 
                  "I am a self-motivated and very open-minded person who can learn very fast. Looking at the job description and my experience in the field of web development, I am confident that I am very much suitable for this role. I enjoy solving problems and I am a great team player. I also believe that my values are aligned with this company’s values. I think this position will support my interest and also give me interesting and exciting opportunities to contribute to the growth of this organization. I am very much excited about this opportunity"]
    indx = torch.randint(0, len(hr_questions), (1,)).item()
    return hr_questions[indx], sample_answers[indx]

def assess_hr_question(question, answer):
    messages = [
        {"role": "system", "content": "You are a helpful AI assistant assigned with the task of preparing students for HR interviews. You can go super harsh on the candidate."},
        {"role": "user", "content": f"{answer}. Here is the answer given by the candidate to the question {question}, give an overall score on his answer out of 10. Your answer should be short and concise about 5 lines"},
    ]

    output = pipe(messages, **generation_args)
    return output[0]['generated_text']

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

def positive_gd_ai(gd_topic, candidate_response):
    start_question = [
        {"role": "system", "content": "You are a helpful AI assistant with the work of helping students improve their group discussion skills."},
        {"role": "user", "content": f"""
        {gd_topic}
        Candidate Response:
        {candidate_response}

        The above given is the group discussion topic given to the candidate for practice and the candidate's response. Help the candidate with a positive response relevant to the topic and supporting his points.
        """.strip()}
    ]

    output = pipe(start_question, **generation_args)
    return output[0]['generated_text'].strip()

def negative_gd_ai(gd_topic, candidate_response):
    start_question = [
        {"role": "system", "content": "You are a helpful AI assistant with the work of helping students improve their group discussion skills."},
        {"role": "user", "content": f"""
        {gd_topic}
        Candidate Response:
        {candidate_response}

        The above given is the group discussion topic given to the candidate for practice and the candidate's response. Help the candidate with a response relevant to the topic and not supoorting his points.
        """.strip()}
    ]

    output = pipe(start_question, **generation_args)
    return output[0]['generated_text'].strip()

@app.route('/group_discussion', methods=['GET'])
def group_discussion():
    gd_topic = "Money"
    p1 = multiprocessing.Process(target=positive_gd_ai, args=(gd_topic, "I am poor"))
    p2 = multiprocessing.Process(target=negative_gd_ai, args=(gd_topic, "I am poor"))
    p1.start()
    p2.start()
    p1.join()
    p2.join()
    return jsonify({"positive_response": p1, "negative_response": p2})

@app.route('/hr_question', methods=['GET'])
def hr_interview():
    question, sample_answer = generate_hr_question()
    answer = ""
    # record audio here and store in answer variable
    assessment = assess_hr_question(question, answer)
    return jsonify({"question": question, "answer": sample_answer, "assessment": assessment})


if __name__ == '__main__':
    app.run(debug=True)