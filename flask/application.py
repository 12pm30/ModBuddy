from flask import Flask, session, abort, redirect, url_for, escape, request, render_template
import indicoio
import json
from indicoio.custom import Collection

#API Setup
keyfile = open('static/indico-api-key.txt')
indicoio.config.api_key = keyfile.read()
keyfile.close()

#Global variables
badWordList = ['alcoholic', 'amateur', 'analphabet', 'anarchist', 'ape', 'arse', 'arselicker', 'ass', 'ass master', 'ass-kisser', 'ass-nugget', 'ass-wipe', 'asshole', 'baby', 'backwoodsman', 'balls', 'bandit', 'barbar', 'bastard', 'bastard', 'beavis', 'beginner', 'biest', 'bitch', 'blubber gut', 'bogeyman', 'booby', 'boozer', 'bozo', 'brain-fart', 'brainless', 'brainy', 'brontosaurus', 'brownie', 'bugger', 'bugger, silly', 'bulloks', 'bum', 'bum-fucker', 'butt', 'buttfucker', 'butthead', 'callboy', 'callgirl', 'camel', 'cannibal', 'cave man', 'chaavanist', 'chaot', 'chauvi', 'cheater', 'chicken', 'children fucker', 'clit', 'clown', 'cock', 'cock master', 'cock up', 'cockboy', 'cockfucker', 'cockroach', 'coky', 'con merchant', 'con-man', 'country bumpkin', 'cow', 'creep', 'creep', 'cretin', 'criminal', 'cunt', 'cunt sucker', 'daywalker', 'deathlord', 'derr brain', 'desperado', 'devil', 'dickhead', 'dinosaur', 'disguesting packet', 'diz brain', 'do-do', 'dog', 'dog, dirty', 'dogshit', 'donkey', 'drakula', 'dreamer', 'drinker', 'drunkard', 'dufus', 'dulles', 'dumbo', 'dummy', 'dumpy', 'egoist', 'eunuch', 'exhibitionist', 'fake', 'fanny', 'farmer', 'fart', 'fart, shitty', 'fatso', 'fellow', 'fibber', 'fish', 'fixer', 'flake', 'flash harry', 'freak', 'frog', 'fuck', 'fuck face', 'fuck head', 'fuck noggin', 'fucker', 'gangster', 'ghost', 'goose', 'gorilla', 'grouch', 'grumpy', 'head, fat', 'hell dog', 'hillbilly', 'hippie', 'homo', 'homosexual', 'hooligan', 'horse fucker', 'idiot', 'ignoramus', 'jack-ass', 'jerk', 'joker', 'junkey', 'killer', 'lard face', 'latchkey child', 'learner', 'liar', 'looser', 'lucky', 'lumpy', 'luzifer', 'macho', 'macker', 'man, old', 'minx', 'missing link', 'monkey', 'monster', 'motherfucker', 'mucky pub', 'mutant', 'neanderthal', 'nerfhearder', 'nobody', 'nurd', 'nuts, numb', 'oddball', 'oger', 'oil dick', 'old fart', 'orang-uthan', 'original', 'outlaw', 'pack', 'pain in the ass', 'pavian', 'pencil dick', 'pervert', 'pig', 'piggy-wiggy', 'pirate', 'pornofreak', 'prick', 'prolet', 'queer', 'querulant', 'rat', 'rat-fink', 'reject', 'retard', 'riff-raff', 'ripper', 'roboter', 'rowdy', 'rufian', 'sack', 'sadist', 'saprophyt', 'satan', 'scarab', 'schfincter', 'shark', 'shit eater', 'shithead', 'simulant', 'skunk', 'skuz bag', 'slave', 'sleeze', 'sleeze bag', 'slimer', 'slimy bastard', 'small pricked', 'snail', 'snake', 'snob', 'snot', 'son of a bitch', 'square', 'stinker', 'stripper', 'stunk', 'swindler', 'swine', 'teletubby', 'thief', 'toilett cleaner', 'tussi', 'typ', 'unlike', 'vampir', 'vandale', 'varmit', 'wallflower', 'wanker', 'wanker, bloody', 'weeze bag', 'whore', 'wierdo', 'wino', 'witch', 'womanizer', 'woody allen', 'worm', 'xena', 'xenophebe', 'xenophobe', 'xxx watcher', 'yak', 'yeti', 'zit face']

hCollection = Collection("HarrassmentCollection")

#Flask crap
application = Flask(__name__)

@application.route("/")
def hello():
    return redirect(url_for('analyze'))


@application.route("/analyze", methods=['GET','POST'])
def analyze():
    if request.method == 'POST':
        if 'request-type' in request.form:
            if request.form['request-type'] == 'web':
                return render_template('analyze.html',results=analyzeText(request.form['comment-text']), commentText=request.form['comment-text'])
            elif request.form['request-type'] == 'array':
                commentArr = json.loads(request.form['comment-text'])
                print str(commentArr)
                outputArr = []
                for idx in range(len(commentArr)):
                    outputArr.append(analyzeText(commentArr[idx]))
                return json.dumps(outputArr) 
            else:
                return analyzeText(request.form['comment-text'])
        else:
            return analyzeText(request.form['comment-text'])
    else: 
        return render_template('analyze.html')

@application.route("/train", methods=['GET','POST'])
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
    resultDict['sentiment'] = indicoio.sentiment(textToAnalyze)
    resultDict['harassingComment'] = hCollection.predict(textToAnalyze)
    resultDict['containsBadWords'] = containsBadWords(textToAnalyze)
    return json.dumps(resultDict)

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
            application.run('0.0.0.0',port=80)

