const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    const reportPath = core.getInput('report_path', { required: true });
    const token = core.getInput('token') || process.env.GITHUB_TOKEN;

    if (!token) {
      core.setFailed('GitHub token not provided. Set the token input or ensure GITHUB_TOKEN is available.');
      return;
    }

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.eventName !== 'pull_request' && context.eventName !== 'pull_request_target') {
      core.info('Action skipped: only runs on pull requests.');
      return;
    }

    const prNumber = context.payload.pull_request?.number;
    if (!prNumber) {
      core.setFailed('Could not determine PR number.');
      return;
    }

    let reportContent;
    try {
      reportContent = fs.readFileSync(reportPath, 'utf8');
    } catch (error) {
      core.setFailed(`Error reading report at ${reportPath}: ${error.message}`);
      return;
    }

    const commentHeader = '<!-- detekt-pr-reporter-action -->';
    const commentBody = `${commentHeader}\n\n## Detekt Report\n\n${reportContent}`;

    const { owner, repo } = context.repo;

    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
    });

    const existingComment = comments.find(c => c.body.startsWith(commentHeader));

    if (existingComment) {
      await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existingComment.id,
        body: commentBody,
      });
      core.info('Updated existing detekt comment.');
    } else {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: commentBody,
      });
      core.info('Created new detekt comment.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
