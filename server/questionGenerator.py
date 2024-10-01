# import torch
# from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
# torch.random.manual_seed(0)
# from utils.pdfread import pdf_read
import ast
import time

# model = AutoModelForCausalLM.from_pretrained(
#     "microsoft/Phi-3.5-mini-instruct",
#     device_map="cuda",
#     torch_dtype="auto",
#     trust_remote_code=True,
#     low_cpu_mem_usage=True,
# )
# tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3.5-mini-instruct")

# pipe = pipeline(
#     "text-generation",
#     model=model,
#     tokenizer=tokenizer,
# )

# generation_args = {
#     "max_new_tokens": 500,
#     "return_full_text": False,
#     "temperature": None,
#     "do_sample": False,
# }



def assess_candidate_response(question, answer, question_count):
    # time.sleep(1)
    if question_count == 1:
        
        return [3.9, 3.8, 3.2]
    else:
        return [2.8, 2.1, 1.7]
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
    except Exception as e:
        print(e)
        pass
    
    # If parsing fails or the result is not in the expected format, return a default score
    return [3, 3, 3]  # Default moderate scores

def generate_interview_question(resume_text):
    return "What framework did you use to integrate the payments feature in the Little Dentist App?"
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

def generate_continuation_question(previous_question, candidate_answer, question_count):
    # time.sleep(1)
    if question_count == 1:
        return "What was the most challenging part of integrating the payments feature in the Little Dentist App?"
    
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