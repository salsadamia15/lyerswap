import Head from 'next/head'
import slug from 'rehype-slug'
import fs from 'fs'
import path from 'path'
import { serialize } from "next-mdx-remote/serialize";
import imageSize from "rehype-img-size";
import React, { useCallback } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import Layout from '../../../components/layout';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import HeaderWithMenu from '../../../components/HeaderWithMenu';
import { MenuProvider } from '../../../context/menu';

const componentOverrides = {
    img: (props) => (
        <img {...props}></img>
    ),
};

export default function UserGuide({
    frontmatter: { title, date, cover_image },
    fileName,
    mdxSource,
}) {
    const router = useRouter();


    const handleGoBack = useCallback(() => {
        router.back()
    }, [router])

    return (
        <div className="bg-[#181C1F]">
            <Head>
                <title>{title}</title>
            </Head>
            <main>
                <div className="flex flex-col justify-centr h-screen content-center items-center mb-5 space-y-5 container mx-auto max-w-3xl py-4 sm:px-6 lg:px-8">
                    <div className="py-4 px-8 mt-6 md:px-0 prose-base prose-headings:text-white prose-a:text-primary-400 text-primary-text">
                        <MDXRemote {...mdxSource} components={componentOverrides} />
                    </div>
                    <button className='text-white' onClick={handleGoBack}>Go back</button>
                </div> 
            </main>
        </div>
    )
}

export async function getStaticProps({ params: { fileName } }) {
    const markdownWithMeta = fs.readFileSync(
        path.join(process.cwd(), 'public/doc/blog/guides', fileName + '.md'),
        'utf-8'
    )

    const { data: frontmatter, content } = matter(markdownWithMeta)

    const mdxSource = await serialize(content, {
        mdxOptions: {
            rehypePlugins: [slug, [imageSize, { dir: "public" }]],
        },
    });

    return {
        props: {
            frontmatter,
            fileName,
            mdxSource,
        },
    }
}

export async function getStaticPaths() {
    const files = fs.readdirSync(path.join('public/doc/blog/guides'));

    return {
        paths: files.map(filename => {
            return {
                params: {
                    fileName: filename.replace('.md', ''),
                }
            }
        }),
        fallback: false
    }
}