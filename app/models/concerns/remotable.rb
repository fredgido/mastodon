# frozen_string_literal: true

module Remotable
  include HttpHelper
  extend ActiveSupport::Concern

  included do
    attachment_definitions.each_key do |attachment_name|
      attribute_name = "#{attachment_name}_remote_url".to_sym
      method_name = "#{attribute_name}=".to_sym

      define_method method_name do |url|
        begin
          parsed_url = Addressable::URI.parse(url).normalize
        rescue Addressable::URI::InvalidURIError
          return
        end

        return if !%w(http https).include?(parsed_url.scheme) || parsed_url.host.empty? || self[attribute_name] == url

        begin
          response = http_client.get(url)

          return if response.code != 200

          matches  = response.headers['content-disposition']&.match(/filename="([^"]*)"/)
          filename = matches.nil? ? parsed_url.path.split('/').last : matches[1]

          send("#{attachment_name}=", StringIO.new(response.to_s))
          send("#{attachment_name}_file_name=", filename)

          self[attribute_name] = url if has_attribute?(attribute_name)
<<<<<<< HEAD
        rescue HTTP::TimeoutError, HTTP::ConnectionError, OpenSSL::SSL::SSLError, Paperclip::Errors::NotIdentifiedByImageMagickError, Addressable::URI::InvalidURIError => e
=======
        rescue HTTP::TimeoutError, OpenSSL::SSL::SSLError, Paperclip::Errors::NotIdentifiedByImageMagickError, Addressable::URI::InvalidURIError => e
>>>>>>> pawoo/migrate_to_v_1_4_7
          Rails.logger.debug "Error fetching remote #{attachment_name}: #{e}"
          nil
        end
      end
    end
  end
end
