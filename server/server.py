import sys
import json
import flask
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.cors import origin
from parse import parse
from flask import render_template
from flask import Response

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class Value(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(120))
    code = db.Column(db.String(20))
    value = db.Column(db.String(120))

    def __init__(self, country, code, value):
        self.country = country
        self.code = code
        self.value = value

    def __repr__(self):
        return '<Code %s Value %r>' % (self.code, self.value)

def populate_database(filename):
    for country, data in parse(filename):
        for code, value in data.items():
            v = Value(country, code, value)
            db.session.add(v)
    db.session.commit()

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/api", methods=["GET", "POST"])
@origin('*')
def api():
    country = flask.request.values["country"]
    values = [
        {
            "code" : v.code,
            "value" : v.value,
        } for v in Value.query.filter_by(country=country)
    ]

    return Response(
        response=json.dumps(values, indent=4), status=200, mimetype="application/json"
    )

if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "populate":
        populate_database(sys.argv[2])
    else:
        app.run(debug=True)

