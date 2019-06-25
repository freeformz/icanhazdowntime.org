workflow "Deploy" {
  on = "push"
  resolves = [
    "Kick Cloudfront",
    "S3 sync",
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

action "S3 sync" {
  uses = "actions/aws/cli@master"
  needs = ["Hugo"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  args = "s3 sync --delete ./public s3://icanhazdowntime.org"
}

action "Kick Cloudfront" {
  uses = "actions/aws/cli@master"
  needs = ["S3 sync"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  args = "cloudfront create-invalidation --distribution-id E35FES56E55UWE --paths '/*'"
}
