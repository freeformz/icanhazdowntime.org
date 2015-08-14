deploy:
	hugo
	s3cmd sync ./public/ s3://icanhazdowntime.org
