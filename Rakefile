# frozen_string_literal: true

require "fileutils"

# Concept extraction from the private iso-10303 source repository.
#
# Usage:
#   ISO_10303_SRC=/path/to/iso-10303 rake concepts:all
#
# Prerequisites:
#   - Ruby 3.1+ with suma gem installed
#   - The iso-10303 source repo checked out locally

ISO_10303_SRC = ENV.fetch("ISO_10303_SRC",
  File.expand_path("../iso-10303", __dir__))

BASE_URN = "urn:iso:std:iso:10303:-2:ed-1:en"

namespace :concepts do
  desc "Extract EXPRESS concepts into .datasets/iso10303-2-express/"
  task :express do
    manifest = File.join(ISO_10303_SRC, "schemas-smrl-part-2.yml")
    unless File.exist?(manifest)
      abort "Schema manifest not found at #{manifest}. " \
            "Set ISO_10303_SRC to the iso-10303 source repo."
    end

    outdir = ".datasets/iso10303-2-express"
    FileUtils.mkdir_p(outdir)
    sh "suma extract-terms #{manifest} #{outdir}/concepts --urn #{BASE_URN}"
  end

  desc "Copy term definitions into .datasets/iso10303-2-terms/"
  task :terms do
    src = File.join(ISO_10303_SRC, "documents/iso-10303-2/dataset/sources")
    unless File.exist?(src)
      abort "Terms dataset not found at #{src}. " \
            "Set ISO_10303_SRC to the iso-10303 source repo."
    end

    dst = ".datasets/iso10303-2-terms"
    FileUtils.mkdir_p(dst)

    FileUtils.rm_rf(File.join(dst, "concepts"))
    FileUtils.cp_r(File.join(src, "concepts"), File.join(dst, "concepts"))

    %w[register.yaml metadata.yaml bibliography.yaml].each do |f|
      FileUtils.cp(File.join(src, f), File.join(dst, f)) if File.exist?(File.join(src, f))
    end
  end

  desc "Extract all concepts (express + terms)"
  task all: [:express, :terms]
end
