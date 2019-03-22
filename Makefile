deploy:
	GIT_COMMIT_SHA=`git rev-parse --verify HEAD` GIT_COMMIT_SHA_SHORT=`git rev-parse --short HEAD` hugo --enableGitInfo
	s3cmd --delete-removed --delete-after -M sync ./public/ s3://icanhazdowntime.org
	s3cmd --recursive del s3://icanhazdowntime.org/css/
	s3cmd -m text/css sync ./public/css/ s3://icanhazdowntime.org/css/