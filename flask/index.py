from flask import Flask, session, abort, redirect, url_for, escape, request, render_template
import indicoio
from indicoio.custom import Collection

#API Setup
keyfile = open('assets/indico-api-key.txt')
indicoio.config.api_key = keyfile.read()
keyfile.close()

#Global variables
badWordList = []
hCollection = Collection("HarrassmentCollection")

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

@app.route("/train", methods=['GET','POST'])
def train():
    if request.method == 'POST':
        if 'harassing-comments' in request.form and 'non-harassing-comments' in request.form:
            trainComments( request.form['non-harassing-comments'], request.form['harassing-comments'])
            return render_template('train.html',results="Successfully completed training.")
        else:
            abort(400)
    else:
        return render_template('train.html')

#My Functions

def containsBadWords( text ):
    lowercaseText = text.lower()
    for line in badWordList:
        if line in lowercaseText:
            return True

    return False

def analyzeText( textToAnalyze ):
    resultDict = {}
    resultDict['request-text'] = textToAnalyze
    resultDict['sentiment'] = indicoio.sentiment(textToAnalyze)
    resultDict['harassing-comment'] = hCollection.predict(textToAnalyze)
    resultDict['contains-bad-words'] = containsBadWords(textToAnalyze)
    return str(resultDict)

def trainComments( goodComments, badComments ):
    goodCommentArr = goodComments.lower().replace('\r','').split('\n')
    badCommentArr = badComments.lower().replace('\r','').split('\n')

    for comment in goodCommentArr:
        hCollection.add_data([[comment, "false"]])

    for comment in badCommentArr:
        hCollection.add_data([[comment, "true"]])

    hCollection.train()
    hCollection.wait()

#main

if __name__ == "__main__":
            badWordList =  [line.strip().lower() for line in open('assets/bad_words.txt')]
            app.run()

