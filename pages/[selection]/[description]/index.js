import Head from "next/head";
import { indexOfSelections } from '../../../public/constants/constants';
import { arrayOfPages } from "../../../public/constants/constants";
import { getCollections } from "../../../lib/mongo/collections";
import Layout from "../../../public/components/Layout";
import Description from "../../../public/components/Description";

export default function DescriptionPage({ route, title, page, selectionData }) {
    return (
        <div
          class="mobile-adjust centralBody"
        >
          <Layout>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="https://i.imgur.com/YuNLXe1.png" />
            </Head>
            <Description selectionData={selectionData[page][route]}/>
            </Layout>
        </div>
    )
}

export async function getStaticPaths() {
    const paths = arrayOfPages.map((x) => {
        return { params: { selection: indexOfSelections[x], description: x }}
    }); 

    return {
        paths: paths, 
        fallback: "blocking" 
    }
}


export async function getStaticProps({ params }) {
    const props = {}
    props.title = params.description.split("-").join(" ").toLocaleUpperCase();
    props.page = params.selection;
    props.route = params.description;

    const { collection } = await getCollections(params.selection);
    if(!collection){
        throw new Error(`Failed to fetch ${params.selection}`);
    }
    delete collection[0]['_id'];
    props.selectionData = collection[0];

    return { 
        props: props
    }; 
} 
