import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import Date from "../../components/date";

import utilStyles from "../../styles/utils.module.css";

import { getAllPostIds, getPostData } from "../../lib/posts";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

export default function Post({
  postData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // TODO: why first postData is undefined?
  // NextJS Static Generation 은 항상 맨 처음 호출을 해보나?
  if (postData === undefined) {
    return (
      <Layout>
        <Head>Empty Post</Head>
        <h1>Empty Post</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
    revalidate: 10, // every 10 second, regeneration
  };
};
