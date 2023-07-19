import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { kv } from '@/modules/database';
import { isUndefined, head, isArray, isString } from 'lodash';
import * as detect from 'react-device-detect';
import { useEffect, useRef } from 'react';

const LinkHashPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { message, webAddr, link } = props;
  const anchorElementRef = useRef<HTMLAnchorElement>(null);
  /*
  const getActualLink = () => {
    if (isAndroid) {
      // return `intent://www.kurly.com#Intent;scheme=https;action=android.intent.action.VIEW;end`;
      return link;
    }
  };
  */
  const handleForwardToApp = () => {
    anchorElementRef?.current?.click();
  };

  useEffect(() => {
    if (!anchorElementRef || !anchorElementRef.current) {
      return;
    }
    handleForwardToApp();
  }, []);

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <div>
      <a href={webAddr}> fallback 용 웹주소</a>
      <a ref={anchorElementRef} href={link}>
        fallback 용 웹주소
      </a>
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
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;
  const { headers } = req;
  const { linkHash } = query;
  const firstLinkHash = getFirstQueryParam(linkHash);
  const { isAndroid, isIOS } = detect.getSelectorsByUserAgent(headers['user-agent'] || '');
  if (isUndefined(firstLinkHash)) {
    return {
      props: {
        message: 'link not found',
      },
    };
  }
  const isWEB = !isIOS && !isAndroid;
  const targetLink = (await kv.get(firstLinkHash)) as string | null;
  if (!targetLink) {
    return {
      props: {
        message: 'link not found',
      },
    };
  }

  const [webAddr, iosAddr, aosAddr] = targetLink.split('|');
  if (isWEB) {
    return {
      redirect: {
        permanent: false,
        destination: webAddr,
      },
    };
  }
  if (isIOS) {
    return {
      props: {
        webAddr,
        link: iosAddr,
        isIOS,
      },
    };
  }
  return {
    props: {
      webAddr,
      link: aosAddr,
      isAndroid,
    },
  };
};

export default LinkHashPage;
