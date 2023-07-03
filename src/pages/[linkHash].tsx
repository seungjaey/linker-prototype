import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { kv } from "@/modules/database";
import { isUndefined, head, isArray, isString } from "lodash";

const LinkHashPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { message } = props;
  return (
    <div>
      {message}
    </div>
  );
};

const getFirstQueryParam = (data?: string | string[]): string => {
  if (isUndefined(data)) {
    return 'INVALID';
  }
  if (isArray(data)) {
    return head(data) as string;
  }
  if (isString(data)) {
    return data;
  }
  return 'INVALID';
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { linkHash } = query;
  const firstLinkHash = getFirstQueryParam(linkHash);
  if (isUndefined(firstLinkHash)) {
    return {
      props: {
        message: 'link not found'
      }
    };
  }
  const targetLink = await kv.get(firstLinkHash);
  console.log(`DEBUG : TARGET_LINK : ${firstLinkHash} : ${targetLink}`);
  return {
    redirect: {
      permanent: false,
      destination: targetLink as string,
    },
  }
}

export default LinkHashPage;