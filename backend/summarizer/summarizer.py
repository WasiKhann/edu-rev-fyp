# backend/summarizer/summarizer.py

import os
import fitz  # PyMuPDF
import google.generativeai as genai
from flask import Blueprint, request, jsonify, current_app

# blueprint
summarizer_bp = Blueprint('summarizer', __name__)

# CORS is already enabled app-wide in app.py

# configure Gemini
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyADWlMOus_QxZEez23tOfWqpWOU13L1fck")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# chapter map
chapter_map = {
    "1": {"title": "The nature of the economic problem", "pages": (2, 5)},
    "2": {"title": "The factors of production",        "pages": (6,10)},
    "3": {"title": "Opportunity cost",                  "pages": (11,13)},
    "4": {"title": "Production possibility curve",      "pages": (14,19)},
    "5": {"title": "Microeconomics and macroeconomics", "pages": (20,23)},
    "6": {"title": "The role of markets in allocating resources", "pages": (24,27)},
    "7": {"title": "Demand",  "pages": (28,33)},
    "8": {"title": "Supply",  "pages": (34,38)},
    "9": {"title": "Price determination", "pages": (39,41)},
    "10": {"title": "Price changes", "pages": (42,45)},
    "11": {"title": "Price elasticity of demand", "pages": (46,56)},
    "12": {"title": "Price elasticity of supply","pages": (57,62)},
    "13": {"title": "Market economic system","pages": (63,66)},
    "14": {"title": "Market failure","pages": (67,72)},
    "15": {"title": "Mixed economic system","pages": (73,85)},
    "16": {"title": "Money and banking","pages": (86,95)},
    "17": {"title": "Households","pages": (96,107)},
    "18": {"title": "Workers","pages": (108,122)},
    "19": {"title": "Trade unions","pages": (123,129)},
    "20": {"title": "Firms","pages": (130,144)},
    "21": {"title": "Firms and production","pages": (145,154)},
    "22": {"title": "Firms' costs, revenue and objectives","pages": (155,161)},
    "23": {"title": "Market structure","pages": (162,169)},
    "24": {"title": "The role of government","pages": (170,172)},
    "25": {"title": "The macroeconomic aims of government","pages": (173,177)},
    "26": {"title": "Fiscal policy","pages": (178,188)},
    "27": {"title": "Monetary policy","pages": (189,192)},
    "28": {"title": "Supply-side policy","pages": (193,197)},
    "29": {"title": "Economic growth","pages": (198,205)},
    "30": {"title": "Employment and unemployment","pages": (206,215)},
    "31": {"title": "Inflation and deflation","pages": (216,229)},
    "32": {"title": "Living standards","pages": (230,234)},
    "33": {"title": "Poverty","pages": (235,242)},
    "34": {"title": "Population","pages": (243,253)},
    "35": {"title": "Differences in economic development between countries","pages": (254,261)},
    "36": {"title": "International specialisation","pages": (262,266)},
    "37": {"title": "Globalisation, free trade and protection","pages": (267,275)},
    "38": {"title": "Foreign exchange rates","pages": (276,283)},
    "39": {"title": "Current account of balance of payments","pages": (284,292)},
}

PDF_PATH = os.path.join(os.path.dirname(__file__), "Econ.pdf")

def extract_text_from_pdf(pdf_path, start_page, end_page):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page_num in range(start_page - 1, end_page):
            text += doc[page_num].get_text()
        return text.strip()
    except Exception as e:
        current_app.logger.error(f"PDF text extraction error: {e}")
        return ""

@summarizer_bp.route('/api/summarize/chapters', methods=['GET'])
def get_chapters():
    try:
        chapters = [{"id": k, "title": v["title"]} for k, v in chapter_map.items()]
        return jsonify(success=True, chapters=chapters)
    except Exception as e:
        current_app.logger.error(f"GET chapters error: {e}")
        return jsonify(success=False, message=str(e)), 500

@summarizer_bp.route('/api/summarize', methods=['POST'])
def summarize_chapter():
    try:
        data = request.get_json()
        num = data.get("chapter")
        if num not in chapter_map:
            return jsonify(success=False, message="Invalid chapter number"), 400

        if not os.path.exists(PDF_PATH):
            return jsonify(success=False, message="Econ.pdf not found on server"), 404

        info = chapter_map[num]
        text = extract_text_from_pdf(PDF_PATH, *info["pages"])
        if not text:
            return jsonify(success=False, message="Failed to extract text from PDF"), 500

        prompt = (
            "Summarize the following IGCSE Economics content, "
            "the summary should be at least 100 words in bullet points, "
            "and it should be as students usually make notes:\n\n"
            + text
        )
        resp = model.generate_content(prompt)
        summary = resp.text

        return jsonify(success=True,
                       chapter={"id": num, "title": info["title"]},
                       summary=summary)

    except Exception as e:
        current_app.logger.error(f"Summarize chapter error: {e}")
        return jsonify(success=False, message=str(e)), 500

