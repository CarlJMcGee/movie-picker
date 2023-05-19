import PusherClient, { Channel } from "pusher-js";
import PusherServer from "pusher";

type channelEvt =
  | "added_to_wishlist"
  | "removed_from_wishlist"
  | "made_available"
  | "made_unavailable"
  | "added_vote"
  | "removed_vote"
  | "we_have_a_winner"
  | "reset";

type channels = "main";

export const pusherClient = new PusherClient("a180f97e989a0566ac2f", {
  cluster: "us2",
  forceTLS: true,
});

export const pusherSever = () =>
  new PusherServer({
    appId: "1524050",
    key: "a180f97e989a0566ac2f",
    secret: "37fdb663607d04957599",
    cluster: "us2",
    useTLS: true,
  });

export const useChannel = (channel: channels) => {
  const Subscription = pusherClient.subscribe(channel);

  function BindEvent<T = void>(
    event: string,
    callBack: (data: T) => any
  ): Channel {
    return Subscription.bind(event, callBack);
  }

  function BindEvents<T = void>(
    events: channelEvt[],
    refetchFtn: (data: T) => any
  ): Channel[] {
    return events.map((e) => Subscription.bind(e, refetchFtn));
  }

  return { Subscription, BindEvent, BindEvents };
};

export async function pushTrigger<D = void>(
  channel: channels[],
  event: channelEvt,
  data: D
): Promise<PusherServer.Response>;
export async function pushTrigger<D = void>(
  channel: channels,
  event: channelEvt,
  data: D
): Promise<PusherServer.Response>;
export async function pushTrigger<D = void>(
  channel: channels | channels[],
  event: channelEvt,
  data: D
): Promise<PusherServer.Response> {
  const trigger = pusherSever().trigger(channel, event, data);
  return trigger;
}
