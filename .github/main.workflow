workflow "Deploy" {
  on = "push"
  resolves = [
    "GitHub Action for AWS",
    "Hugo",
    "Master",
  ]
}

action "Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Hugo" {
  uses = "./Dockerfile.build"
  runs = ["sh", "-c", "GIT_COMMIT_SHA=`git rev-parse --verify HEAD` GIT_COMMIT_SHA_SHORT=`git rev-parse --short HEAD` hugo --enableGitInfo"]
  needs = ["Master"]
}

action "GitHub Action for AWS" {
  uses = "actions/aws/cli@master"
  needs = ["Hugo"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
}
