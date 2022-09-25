from flask import Flask, render_template, request
import requests


CUSTODIAN_URL = "http://localhost:5000"
CUSTODIAN_ADD_FILE_URL = CUSTODIAN_URL + "/files"


def create_app():
    app = Flask(__name__, template_folder=".")
    
    @app.route("/", methods=["GET", "POST"])
    def home():
        if request.method == "GET":
            return render_template("index.html")
        elif request.method == "POST":
            files = {
                k:
                    (v.filename, v.stream, v.content_type, v.headers)
                    for k, v in request.files.items()
            }
            print(files)
            response = requests.post(
                CUSTODIAN_ADD_FILE_URL,
                files=files
            )
            return response.text
        else:
            raise Exception("Unrecognized method: {}" % request.method)

    return app

if __name__ == "__main__":
    create_app().run(host="localhost", port=4800)
