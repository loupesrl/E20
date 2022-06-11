import dynamic from "next/dynamic";

const Event = dynamic(() => import("../../../../../components/event"), {
  ssr: false,
});

export default function OrgPage({ orgId, eventId }) {
  return <Event orgId={orgId} eventId={eventId} />;
}

export async function getServerSideProps(context) {
  const { id: orgId, eventId } = context.params;

  return {
    props: { orgId, eventId }, // will be passed to the page component as props
  };
}
