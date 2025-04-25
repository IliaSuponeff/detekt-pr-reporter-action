const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
    try {
        const reportPath = core.getInput('report_path', { required: true });
        const reportContent = fs.readFileSync(reportPath, 'utf8');

        const { context } = github;
        const pullRequest = context.payload.pull_request;

        if (!pullRequest) {
            core.setFailed('This action can only be run on pull requests.');
            return;
        }

        const githubToken = core.getInput('github_token', { required: true });
        const octokit = github.getOctokit(githubToken);

        await octokit.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pullRequest.number,
            body: reportContent,
        });

        core.info('Detekt report published to pull request.');
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
