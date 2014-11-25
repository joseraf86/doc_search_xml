require File.dirname(__FILE__) + '/../test_helper'
require "#{RAILS_ROOT}/vendor/plugins/backgroundrb/backgroundrb.rb"
require "#{RAILS_ROOT}/lib/workers/procesar_documento_worker"
require 'drb'

class ProcesarDocumentoWorkerTest < Test::Unit::TestCase

  # Replace this with your real tests.
  def test_truth
    assert ProcesarDocumentoWorker.included_modules.include?(DRbUndumped)
  end
end
