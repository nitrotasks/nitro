require 'should'
Time = require '../source/scripts/utils/time'

describe 'Time', ->

  it 'should get the current time in seconds', ->

    now = Time.now()
    now.should.be.a.Number
    Math.floor(Date.now() / 1000).should.equal now

  it 'should convert a time to a date', ->

    time = Time.now()
    date = Time.toDate(time)
    date.getTime().should.equal(time * 1000)


  it 'should convert an existing timestamp to seconds', ->

    date = new Date('01/02/03').getTime()
    date.should.equal 1041418800000
    time = Time.from date
    time.should.equal 1041418800
