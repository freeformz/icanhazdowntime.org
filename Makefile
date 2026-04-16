.PHONY: deploy tools twitter-archive

tools:
	brew install hugo awscli

twitter-archive:
	node scripts/process-twitter-archive.js

deploy:
	GIT_COMMIT_SHA=`git rev-parse --verify HEAD` GIT_COMMIT_SHA_SHORT=`git rev-parse --short HEAD` hugo --enableGitInfo
	npx -y pagefind --site public
	aws s3 sync --profile icanhazdowntime --delete ./public s3://icanhazdowntime.org
	aws cloudfront create-invalidation --profile icanhazdowntime --distribution-id E35FES56E55UWE --paths '/*'