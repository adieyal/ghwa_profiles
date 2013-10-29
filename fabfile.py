from fabdefs import *
from fabric import api
import os

python = "%s/bin/python" % env_dir
pip = "%s/bin/pip" % env_dir

def deploy():
    with api.cd(code_dir):
        api.run("git pull origin master")
        api.run("%s install -r %s/deploy/requirements.txt --quiet" % (pip, code_dir))
        api.run("source %s/bin/activate; make setup" % env_dir)

        api.sudo("supervisorctl restart ghwa")
