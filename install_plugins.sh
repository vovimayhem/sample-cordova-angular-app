#!/usr/bin/env ruby
begin
  require 'nokogiri'

  config_data = Nokogiri::XML(File.read("#{Dir.pwd}/config.xml"))

  # A list of plugins no longer available on the npm repositories, nor on the
  # cordova repositories.
  PLUGIN_GIT_MAP={

    "com.wizardlogic.cordova.ios_keyboard" =>
      "https://github.com/mhweiner/CordovaiOSKeyboardPlugin.git#1.0.0",

    "com.badrit.backbutton" =>
      "https://github.com/mohamed-salah/phonegap-backbutton-plugin.git",

    "com.millerjames01.sqlite-plugin" =>
      "https://github.com/millerjames01/Cordova-SQLitePlugin.git",
  }

  config_data.xpath("/xmlns:widget/xmlns:plugin").each do |plugin|
    name = plugin.attribute('name').to_s
    version = if (version = plugin.attribute('version'))
      version.to_s
    end

    # If the plugin is no longer on the PGB nor de NPM repos, get it from Git:
    if PLUGIN_GIT_MAP.key?(name)
      name = PLUGIN_GIT_MAP[name]
      version = nil
    end

    command = 'cordova plugin add ' + [ name, version ].compact.join('@')

    system command
  end

rescue LoadError => e
  puts "You must first run 'gem install nokogiri' for this script to run."
end
