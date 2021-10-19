import fs from "fs";
import path from "path";
import matter from "gray-matter";
import markdownToHtml from "./markdown";

const postsDirectory = path.join(process.cwd(), "posts");

type BlogMetaData = {
  date: string;
  title: string;
};

export function getSortedPostsData() {
  // Get file names under /posts
  const filesNames = fs.readdirSync(postsDirectory);
  const allPostsData = filesNames.map((filesName) => {
    const id = filesName.replace(/\.md$/, "");

    const fullPath = path.join(postsDirectory, filesName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);
    return {
      id,
      ...(matterResult.data as BlogMetaData),
    };
  });

  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getAllPostIds() {
  const filenames = fs.readdirSync(postsDirectory);
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return filenames.map((filename) => {
    return {
      params: {
        id: filename.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const contentHtml = await markdownToHtml(matterResult.content);

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
