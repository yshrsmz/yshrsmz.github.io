import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

async function run(): Promise<void> {
  console.log("@codingfeline/action-create-scrap start")
  const repo = context.repo;

  try {
    const token = getInput("github_token", { required: true });
    const issueNumber = Number(getInput("issue_number", { required: true }));

    const octokit = getOctokit(token);

    const { data, status } = await octokit.rest.issues.get({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
    });

    console.log({ status, data });
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed(`Unknown error: ${error}`);
    }
  }
}

run();
