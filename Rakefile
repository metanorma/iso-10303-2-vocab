# frozen_string_literal: true

require "fileutils"

# ISO 10303-2 Vocabulary Site — Rake tasks for concept generation and site management.
#
# The iso-10303 source repository (private) contains EXPRESS schemas.
# The iso-10303-2 repository (public) hosts the extracted concept dataset
# and the concept-browser deployment configuration.
#
# Prerequisites:
#   - Ruby 3.1+ with suma gem installed (or use Docker)
#   - Node.js 20+ with npm
#   - The iso-10303 source repo cloned at ISO_10303_SRC (or ../iso-10303)

# Path to the private iso-10303 source repository containing EXPRESS schemas.
# Override with env var ISO_10303_SRC.
ISO_10303_SRC = ENV.fetch("ISO_10303_SRC",
  File.expand_path("../iso-10303", __dir__))

# Base URN for ISO 10303-2 concepts.
BASE_URN = "urn:iso:std:iso:10303:-2:ed-1:en"

# Dataset output directories (within this repo).
TERMS_DIR   = ".datasets/iso10303-2-terms"
EXPRESS_DIR = ".datasets/iso10303-2-express"

namespace :concepts do
  desc "Extract EXPRESS concepts from all schemas into .datasets/iso10303-2-express/"
  task :express do
    manifest = File.join(ISO_10303_SRC, "schemas-smrl-part-2.yml")
    unless File.exist?(manifest)
      abort <<~MSG
        Schema manifest not found at #{manifest}
        Set ISO_10303_SRC to point to the iso-10303 source repository.
        Current: ISO_10303_SRC=#{ISO_10303_SRC}
      MSG
    end

    FileUtils.mkdir_p(EXPRESS_DIR)
    puts "Extracting EXPRESS concepts from #{manifest}..."
    puts "  Output: #{EXPRESS_DIR}/concepts/"

    sh "suma extract-terms #{manifest} #{EXPRESS_DIR}/concepts " \
       "--urn #{BASE_URN}"

    puts "Done. EXPRESS concepts extracted to #{EXPRESS_DIR}/concepts/"
  end

  desc "Copy term definitions from the iso-10303 source repo into .datasets/iso10303-2-terms/"
  task :terms do
    src_dataset = File.join(ISO_10303_SRC,
                            "documents/iso-10303-2/dataset/sources")
    unless File.exist?(src_dataset)
      abort <<~MSG
        Terms dataset not found at #{src_dataset}
        Set ISO_10303_SRC to point to the iso-10303 source repository.
        Current: ISO_10303_SRC=#{ISO_10303_SRC}
      MSG
    end

    FileUtils.mkdir_p(TERMS_DIR)

    # Copy concepts
    src_concepts = File.join(src_dataset, "concepts")
    dst_concepts = File.join(TERMS_DIR, "concepts")
    if File.exist?(dst_concepts)
      FileUtils.rm_r(dst_concepts)
    end
    FileUtils.cp_r(src_concepts, dst_concepts)

    # Copy register.yaml
    %w[register.yaml metadata.yaml bibliography.yaml].each do |f|
      src = File.join(src_dataset, f)
      dst = File.join(TERMS_DIR, f)
      FileUtils.cp(src, dst) if File.exist?(src)
    end

    puts "Done. Terms copied to #{TERMS_DIR}/"
  end

  desc "Extract all concepts (express + terms)"
  task all: [:express, :terms]
end

namespace :site do
  desc "Install npm dependencies"
  task :install do
    sh "npm install"
  end

  desc "Generate concept browser data from .datasets/"
  task :generate do
    sh "npx concept-browser generate"
  end

  desc "Build cross-reference edges"
  task :edges do
    sh "npx concept-browser edges"
  end

  desc "Build the site for production"
  task build: [:generate, :edges] do
    sh "SITE_TITLE='ISO 10303-2 Vocabulary' " \
       "SITE_FONTS_URL='https://fonts.googleapis.com/css2?" \
       "family=Roboto+Condensed:wght@700&" \
       "family=Roboto:wght@400;500;700&display=swap' " \
       "npx vite build --config " \
       "node_modules/@glossarist/concept-browser/vite.config.ts"
    # SPA fallback
    FileUtils.cp("dist/index.html", "dist/404.html") if File.exist?("dist/index.html")
  end

  desc "Full pipeline: concepts + build"
  task full: ["concepts:all", :build]

  desc "Start development server"
  task :dev do
    sh "npm run dev"
  end
end

task default: "site:build"
