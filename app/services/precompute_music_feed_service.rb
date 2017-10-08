# frozen_string_literal: true

class PrecomputeMusicFeedService < BaseService
  LIMIT = FeedManager::MAX_ITEMS / 4

  def call(account)
    @account = account
    populate_feed
  end

  private

  attr_reader :account

  def populate_feed
    pairs = statuses.reverse_each.reject(&method(:status_filtered?)).map(&method(:process_status)).to_a

    redis.pipelined do
      redis.zadd(account_home_key, pairs) if pairs.any?
      redis.del("account:#{@account.id}:music:regeneration")
    end
  end

  def process_status(status)
    [status.id, status.reblog? ? status.reblog_of_id : status.id]
  end

  def status_filtered?(status)
    FeedManager.instance.filter?(:home, status, account.id)
  end

  def account_home_key
    FeedManager.instance.music_key(:home, account.id)
  end

  def statuses
    Status.as_home_timeline(account).where.not(music_type: nil).order(account_id: :desc).limit(LIMIT)
  end

  def redis
    Redis.current
  end
end
