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
  uses = "freeformz/hugo-action@master"
  needs = ["Master"]
  args = "--enableGitInfo"
}

action "GitHub Action for AWS" {
  uses = "actions/aws/cli@master"
  needs = ["Hugo"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  args = "s3 sync --delete ./public s3://icanhazdowntime.org"
}
