deploy:
	GIT_COMMIT_SHA=`git rev-parse --verify HEAD` GIT_COMMIT_SHA_SHORT=`git rev-parse --short HEAD` hugo
	s3cmd sync ./public/ s3://icanhazdowntime.org
