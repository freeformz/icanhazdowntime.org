.PHONY: deploy tools

tools:
	brew install hugo awscli

deploy:
	GIT_COMMIT_SHA=`git rev-parse --verify HEAD` GIT_COMMIT_SHA_SHORT=`git rev-parse --short HEAD` hugo --enableGitInfo
	aws s3 sync --profile icanhazdowntime --delete ./public s3://icanhazdowntime.org
	aws cloudfront create-invalidation --profile icanhazdowntime --distribution-id E35FES56E55UWE --paths '/*'