import dynamic from "next/dynamic";

const Org = dynamic(() => import("../../components/org"), { ssr: false });

export default function OrgPage({ orgId }) {
  return <Org orgId={orgId} />;
}

export async function getServerSideProps(context) {
  const { id: orgId } = context.params;

  return {
    props: { orgId }, // will be passed to the page component as props
  };
}
