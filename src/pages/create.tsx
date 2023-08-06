import { IOS_PREFIX, AOS_PREFIX, TARGET_BASE_HOST } from '@/configs';
import { useRef, useState } from 'react';
import { chain, get, isEmpty } from 'lodash';
import axios from 'axios';
import { InformationCircle } from '../icons/information-circle';

// AOS fallback location.href = 'https://play.google.com/store/apps/details?id=com.dbs.kurly.m2';
interface FormData {
  webAddr: string;
  iosAddr: string;
  aosAddr: string;
}

const CreateLinkPage = () => {
  const formElementRef = useRef<HTMLFormElement>(null);
  const [url, setUrl] = useState('');
  const handleClickCancel = () => {
    if (!formElementRef || !formElementRef.current) {
      return;
    }
    formElementRef.current.reset();
  };
  const handleClickCreate = () => {
    if (!formElementRef || !formElementRef.current) {
      return;
    }
    const formEl = formElementRef.current;
    const formData = chain(['webAddr', 'iosAddr', 'aosAddr'])
      .map((key) => [key, get(formEl, `${key}.value`)])
      .fromPairs()
      .value() as FormData;
    handleCreate(formData);
  };
  const handleCreate = async (formData: FormData) => {
    // TODO: Meta Data 추출
    const { data } = await axios.post('/api/v2/create', formData);
    setUrl(data?.result);
  };
  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('클립보드에 링크가 복사되었습니다.');
    } catch (e) {
      alert('복사에 실패하였습니다');
    }
  };

  return (
    <div className="md:container md:mx-auto p-4">
      {!isEmpty(url) ? <div>{url}</div> : null}

      <form ref={formElementRef}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
            {url ? (
              <div className="my-5">
                <span> 미리보기 url : {url} </span>
                <button
                  type="button"
                  onClick={handleCopyClipBoard}
                  className="rounded-md bg-purple-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  복사하기
                </button>
                <div className="flex">
                  <InformationCircle />
                  <span className="ml-3 text-rose-700"> main 페이지가 보일 시 주소를 다시 확인해주세요!</span>
                </div>
              </div>
            ) : null}
            {typeof window !== 'undefined' && url ? (
              <iframe src={url} width="100%" height="500px">
                <p>사용 중인 브라우저는 iframe을 지원하지 않습니다.</p>
              </iframe>
            ) : null}
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="webAddr" className="block text-sm font-medium leading-6 text-gray-900">
                  웹 주소
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                      {TARGET_BASE_HOST}
                    </span>
                    <input
                      type="text"
                      name="webAddr"
                      id="webAddr"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="iosAddr" className="block text-sm font-medium leading-6 text-gray-900">
                  IOS 주소
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{IOS_PREFIX}</span>
                    <input
                      type="text"
                      name="iosAddr"
                      id="iosAddr"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="aosAddr" className="block text-sm font-medium leading-6 text-gray-900">
                  AOS 주소
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{AOS_PREFIX}</span>
                    <input
                      type="text"
                      name="aosAddr"
                      id="aosAddr"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" onClick={handleClickCancel} className="text-sm font-semibold leading-6 text-gray-900">
            취소
          </button>
          <button
            type="button"
            onClick={handleClickCreate}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLinkPage;
