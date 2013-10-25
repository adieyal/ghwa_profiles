setup:
	rm server/test.db
	python server/create_db.py
	python server/server.py populate data/profiles.xlsx data/IHME.xls

run:
	python server/server.py
