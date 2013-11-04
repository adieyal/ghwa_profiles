import sys
import json
import flask
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.cors import origin
from parse import ProfileParser, IHMEParser
from flask import render_template
from flask import Response
from werkzeug.contrib.fixers import ProxyFix

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

class DALY(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(120))
    code = db.Column(db.String(20))
    rank = db.Column(db.Integer)
    cause = db.Column(db.String(30))
    perc = db.Column(db.Float)
    color = db.Column(db.String(10))

    def __init__(self, country, code, rank, cause, perc, color):
        self.country = country
        self.code = code
        self.rank = rank
        self.cause = cause
        self.perc = perc
        self.color = color

    def __repr__(self):
        return '<Code %s>' % (self.code)

def populate_database(fn_profile, fn_daly):
    parser = ProfileParser(fn_profile)
    for country, data in parser.parse_profiles():
        for code, value in data.items():
            v = Value(country, code, value)
            db.session.add(v)
    db.session.commit()

    parser = IHMEParser(fn_daly)
    for data in parser.parse_data():
        d = DALY(data["country"], data["code"], data["rank"], data["cause"], data["perc"], data["color"])
        db.session.add(d)
    db.session.commit()

@app.route("/api/profiles", methods=["GET", "POST"])
@origin('*')
def api_profiles():
    country = flask.request.values["country"]
    values = dict([
        (v.code, v.value) for v in Value.query.filter_by(country=country) if v.code
    ])

    return Response(
        response=json.dumps(values, indent=4), status=200, mimetype="application/json"
    )

@app.route("/api/daly", methods=["GET", "POST"])
@origin('*')
def api_daly():
    country = flask.request.values["country"]
    values = [
        {
            "rank" : v.rank, "text" : v.cause, 
            "value" : v.perc, "color" : v.color
        } for v in DALY.query.filter_by(country=country).order_by('rank') if v.code and v.rank <= 10
    ]

    return Response(
        response=json.dumps(values, indent=4), status=200, mimetype="application/json"
    )

app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == "__main__":
    if len(sys.argv) == 4 and sys.argv[1] == "populate":
        populate_database(sys.argv[2], sys.argv[3])
    else:
        app.run(debug=True)

