import dynamic from "next/dynamic";

const EventInstance = dynamic(
  () => import("../../../../../../../components/eventInstance"),
  {
    ssr: false,
  }
);

export default function EventInstancePage({ orgId, eventId, eventInstanceId }) {
  return (
    <EventInstance
      orgId={orgId}
      eventId={eventId}
      eventInstanceId={eventInstanceId}
    />
  );
}

export async function getServerSideProps(context) {
  const { id: orgId, eventId, eventInstanceId } = context.params;

  return {
    props: { orgId, eventId, eventInstanceId }, // will be passed to the page component as props
  };
}
