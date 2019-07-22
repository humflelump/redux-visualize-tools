import { commChannel } from './index';

export function attachCommChannelToWindow() {
    (<any>window).commChannel = commChannel;
    console.log('attached wow2');
} 