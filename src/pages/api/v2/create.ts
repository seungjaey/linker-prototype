import { eq } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createLinkHash } from '@/modules/link';
import { kv } from '@/modules/database';

import { TARGET_BASE_HOST, IOS_PREFIX, AOS_PREFIX } from '@/configs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  const { targetUrl } = body;
  if (!eq(method, 'POST')) {
    res.status(422).send('Cannot process');
    return;
  }
  const { webAddr, iosAddr, aosAddr } = body;
  // TODO: Kurly URL 인 경우
  const linkHash = createLinkHash(targetUrl);
  await kv.set(linkHash, `${TARGET_BASE_HOST}${webAddr}|${IOS_PREFIX}${iosAddr}|${AOS_PREFIX}${aosAddr}`);
  return res.status(200).json({
    original: targetUrl,
    // TODO: ENV 변수로 링커 host 할당
    result: `${process.env.LINKER_HOST}/entry/${linkHash}`,
  });
}
