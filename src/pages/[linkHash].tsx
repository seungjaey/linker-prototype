import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { kv } from "@/modules/database";
import { isUndefined, head } from "lodash";

const LinkHashPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { message } = props;
  return (
    <div>
      {message}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { linkHash } = query;
  const firstLinkHash = head(linkHash);
  if (isUndefined(firstLinkHash)) {
    return {
      props: {
        message: 'link not found'
      }
    };
  }
  const targetLink = await kv.get(firstLinkHash);
  console.log(`DEBUG : TARGET_LINK : ${targetLink}`);
  return {
    redirect: {
      permanent: false,
      destination: targetLink as string,
    },
  }
}

export default LinkHashPage;