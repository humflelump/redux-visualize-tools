import { commChannel } from './index';

export function attachCommChannelToWindow() {
  (window as any).commChannel = commChannel;
  console.log('attached', commChannel);
}
