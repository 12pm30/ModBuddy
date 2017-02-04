from flask import Flask, session, redirect, url_for, escape, request, render_template
import indicoio
indicoio.config.api_key = 'api-key-goes-here'

#Global variables
badWordList = []

#Flask crap
app = Flask(__name__)

@app.route("/")
def hello():
    return redirect(url_for('analyze'))


@app.route("/analyze", methods=['GET','POST'])
def analyze():
    if request.method == 'POST':
        if 'request-type' in request.form:
            if request.form['request-type'] == 'web':
                return render_template('analyze.html',results=analyzeText(request.form['comment-text']))
            else:
                return analyzeText(request.form['comment-text'])
        else:
            return analyzeText(request.form['comment-text'])
    else: 
        return render_template('analyze.html')


#My Functions

def containsBadWords( text ):
    lowercaseText = text.lower()
    for line in badWordList:
        if line in lowercaseText:
            return True

    return False

def analyzeText( textToAnalyze ):
    resultDict = {}

    resultDict['sentiment'] = indicoio.sentiment(textToAnalyze)
    resultDict['containsBadWords'] = containsBadWords(textToAnalyze);
    return str(resultDict)

#main

if __name__ == "__main__":
            badWordList =  [line.strip().lower() for line in open('assets/bad_words.txt')]
            app.run()

