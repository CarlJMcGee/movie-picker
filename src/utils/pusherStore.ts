import PusherClient, { Channel } from "pusher-js";
import PusherServer from "pusher";

interface IPusherInfo {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
  useTLS: boolean;
}

PusherClient.logToConsole = true;
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

export const channels = {
  main: "main-channel",
};

export const useChannel = (
  channel: string
): {
  Subscription: Channel;
  Bind: <T = void>(event: string, callBack: (data: T) => any) => Channel;
} => {
  const Subscription = pusherClient.subscribe(channel);
  function Bind<T = void>(event: string, callBack: (data: T) => any): Channel {
    return Subscription.bind(event, callBack);
  }
  return { Subscription, Bind };
};
