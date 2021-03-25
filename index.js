const fetch = require("./fetch");

if (!process.env.GITHUB_TOKEN) {
  console.error("🔴 no GITHUB_TOKEN found. pass `GITHUB_TOKEN` as env");
  process.exitCode = 1;
  return;
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let owner, repo;

if (process.env.INPUT_REPO) {
  [owner, repo] = process.env.INPUT_REPO.split("/");
} else if (process.env.GITHUB_REPOSITORY) {
  [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
} else {
  console.error("🔴 no GITHUB_REPOSITORY found. pass `GITHUB_REPOSITORY` as env or owner/repo as inputs");
  process.exitCode = 1;
  return;
}
console.log(`📕  given repo is "${owner}/${repo}"`);

if (!process.env.INPUT_TAG_NAME) {
  console.error("🌶  no tag name found. use `tag_name` to pass value");
  process.exitCode = 1;
  return;
}
const tagName = process.env.INPUT_TAG_NAME;

const commonOpts = {
  host: "api.github.com",
  port: 443,
  protocol: "https:",
  auth: `user:${GITHUB_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "node.js",
  },
};

console.log(`🏷  given tag is "${tagName}"`);

const tagRef = `${tagName}`;

async function deleteTag() {
  try {
    const _ = await fetch({
      ...commonOpts,
      path: `/repos/${owner}/${repo}/git/${tagRef}`,
      method: "DELETE",
    });

    console.log(`✅  tag "${tagName}" deleted successfully!`);
  } catch (error) {
    console.error(`🌶  failed to delete ref "${tagRef}" <- ${error.message}`);
    if (error.message === "Reference does not exist") {
      console.error("😕  Proceeding anyway, because tag not existing is the goal");
    } else {
      console.error(`🌶  An error occured while deleting the tag "${tagName}"`);
      process.exitCode = 1;
    }
    return;
  }
}

async function run() {
  await deleteTag();
}

run();
