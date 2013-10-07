setup:
	python server/create_db.py
	python server/server.py populate data/profiles.xlsx

run:
	python server/server.py
