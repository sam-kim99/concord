class ChannelsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    channel = Channel.find_by(id: params[:channelId])
    stream_for channel if channel
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
