# ModBuddy Anti-Harassment RESTful API

![ModBuddy Picture](https://github.com/jeremyroy/ModBuddy/blob/master/cube.png)

ModBuddy is composed of two parts- a RESTful API that performs analysis on text, and a chrome extension that submits comments from Reddit for analysis.

ModBuddy uses indico.io APIs to run sentiment analysis and a custom anti-harassment text model. ModBuddy also includes detection for many common vulgar words.

The chrome extension makes POST requests to /analyze, and based on the response will highlight comments to indicate a potentially harassing or vulgar comment to the moderator.

## How to use the ModBuddy Chrome Extension

- Go to `chrome:://extensions`, enable developer mode.
- Click `Load unpacked extension`
- Navigate to and select the ModBuddy root directory

[Here's an example of how harassing comment highlighting works](https://github.com/jeremyroy/ModBuddy/blob/python-flask-server/images/example_reddit.png)

## How to use the ModBuddy API

The ModBuddy server is built on the flask framework. You must have a valid installation of Python 2.7 and install the following packages using pip

* flask
* indicoio

After installing prerequisites, you must create a file called `indico-api-key.txt` in the flask/static folder, containing only your API key from the indico dashboard. To get an API key, you can sign up for a free account. Then, run `python application.py`, and the server will be available at 127.0.0.1 on port 80.

### Demo Pages

To demonstrate the functionality without an API client, a simple web form was created. To train the model, navigate to /train and enter comments (one per line) as "non harassing" or "harassing" and click `Submit Training Form`. Then, navigate to /analyze (root will redirect you there), and enter a comment to be analyzed. The response will show the JSON objects returned by the API.

[Example of an acceptable comment](https://github.com/jeremyroy/ModBuddy/blob/python-flask-server/images/cats_cute.png)

[Example of a harassing comment](https://github.com/jeremyroy/ModBuddy/blob/python-flask-server/images/smell_monkey.png)

### API Reference

[/analyze](https://github.com/jeremyroy/ModBuddy/blob/master/flask/docs/analyze.md)

[/train](https://github.com/jeremyroy/ModBuddy/blob/master/flask/docs/train.md)

### Deploying on AWS Elastic Beanstalk

To deploy on AWS elastic beanstalk, create a Python 2.7 instance in your desired configuration (Low cost instances are eligible for the free tier). Create a zip file with the files found in the flask folder. (application.py should be at the root!). Then, simply upload the zip file as the application you wish to deploy.

### API Limitations

Currently, only the English language is supported. With a small amount of training data, classification may not be as accurate as possible.
