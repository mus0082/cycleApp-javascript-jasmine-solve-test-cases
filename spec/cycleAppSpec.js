/* globals describe it xdescribe xit beforeEach expect cycleApp localStorage STORAGE_KEY */
describe('cycleApp', function () {
  var thecycleApp

  function getdestinations (allTrips) {
    const alldestinations = []
    for (const aTrip of allTrips) {
      alldestinations.push(aTrip.destination)
    }
    return alldestinations
  }

  beforeEach(function () {
    thecycleApp = new cycleApp()
  })

  describe('adding trips', function () {
 
    // FEATURE 2. Add a trips
    describe('when a single Trip with a destination of "a new Trip" is added', function () {
      var theTrip
      beforeEach(function () {
        thecycleApp.addTrip('a new Trip')
        theTrip = thecycleApp.allMytrips[0]
      })

      describe('the added single Trip', function () {
        it('should have an id of 1', function () {
          expect(theTrip.id).toBe(1)
        })

        it('should have a destination of "a new Trip"', function () {
          expect(theTrip.destination).toBe('a new Trip')
        })

        it('should not be completed', function () {
          expect(theTrip.completed).toBeFalsy()
        })
      })

      describe('the cycleApp app', function () {
        it('should have one Trip', function () {
          expect(thecycleApp.allMytrips.length).toBe(1)
        })

        it('should have 1 active Trip remaining', function () {
          expect(thecycleApp.remaining()).toBe(1)
        })

        it('should not be "all done"', function () {
          expect(thecycleApp.getAllDone()).toBeFalsy()
        })
      })
    })

    describe('when three trips are added', function () {
      it('should have 3 trips', function () {
        thecycleApp.addTrip('1st')
        thecycleApp.addTrip('2nd')
        thecycleApp.addTrip('3rd')
        expect(thecycleApp.allMytrips.length).toBe(3)
      })
    })
  })

  // FEATURE 6. Save all trips to LocalStorage
  describe('save', function () {
    it('should save an Trip in localStorage when it kas a single item', function () {
      localStorage.clear()
      thecycleApp = new cycleApp()
      thecycleApp.addTrip('a new Trip')
      thecycleApp.save()
      var itemJSON = localStorage.getItem(STORAGE_KEY)
      expect(itemJSON).toBeTruthy()
    })

    it('should have the correct JSON for the correct Trip in localStorage', function () {
      localStorage.clear()
      thecycleApp = new cycleApp()
      thecycleApp.addTrip('a new Trip')
      thecycleApp.save()
      var itemJSON = localStorage.getItem(STORAGE_KEY)
      expect(itemJSON).toBe('[{"id":1,"destination":"a new Trip","completed":false}]')
    })
  })

  // FEATURE 7. Load all trips from LocalStorage
  describe('load', function () {
    it('should load an Trip from localStorage when it has a single Trip', function () {
      // save something
      localStorage.clear()
      thecycleApp = new cycleApp()
      thecycleApp.addTrip('a new todo')
      thecycleApp.save()
      // the start the model again
      thecycleApp = new cycleApp()
      // and load
      thecycleApp.load()
      var itemJSON = localStorage.getItem(STORAGE_KEY)
      expect(itemJSON).toBeTruthy()
    })

    it('should have the correct JSON for the loaded item', function () {
      // save something
      localStorage.clear()
      thecycleApp = new cycleApp()
      thecycleApp.addTrip('a new Trip')
      thecycleApp.save()
      // the start the model again
      thecycleApp = new cycleApp()
      // and load
      thecycleApp.load()
      var itemJSON = localStorage.getItem(STORAGE_KEY)
      expect(itemJSON).toBe('[{"id":1,"destination":"a new Trip","completed":false}]')
    })
  })

  // FEATURE 3. Sort trips
  describe('sorting trips', function () {
    it('should put trips into alphabetic destination order', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('c')
      thecycleApp.addTrip('a')
      thecycleApp.addTrip('b')
      thecycleApp.sorttrips()
      const actualOrderedTripdestinations = getdestinations(thecycleApp.allMytrips)
      const expectedSortedTripdestinations = ['a', 'b', 'c']
      expect(expectedSortedTripdestinations).toEqual(actualOrderedTripdestinations)
    })
  })

  // FEATURE 4. Filter trips
  describe('filtering trips', function () {
    var thecycleApp = new cycleApp()
    thecycleApp.addTrip('a')
    thecycleApp.addTrip('b')
    thecycleApp.addTrip('c')
    thecycleApp.allMytrips[1].completed = true

    it('should be able to return only active/remaining trips', function () {
      const expectedActiveCount = 2
      const expectedActiveTripdestinations = ['a', 'c']
      const actualActiveList = thecycleApp.getActivetrips()
      const actualActiveCount = actualActiveList.length
      const actualActiveTripdestinations = getdestinations(actualActiveList)

      expect(actualActiveCount).toBe(expectedActiveCount)
      expect(actualActiveTripdestinations).toEqual(expectedActiveTripdestinations)
    })

    it('should be able to return only completed trips', function () {
      const expectedCompletedCount = 1
      const expectedCompletedTripdestinations = ['b']
      const actualCompletedList = thecycleApp.getCompletedtrips()
      const actualCompletedCount = actualCompletedList.length
      const actualCompletedTripdestinations = getdestinations(actualCompletedList)
      expect(actualCompletedCount).toBe(expectedCompletedCount)
      expect(actualCompletedTripdestinations).toEqual(expectedCompletedTripdestinations)
    })

    it('should correctly calculate the number of remaining trips', function () {
      const expectedRemainingCount = 2
      const actualRemainingCount = thecycleApp.remaining()
      expect(actualRemainingCount).toBe(expectedRemainingCount)
    })
  })

  // FEATURE 5. Delete a selected trips
  describe('deleting a Trip', function () {
    var thecycleApp = new cycleApp()
    thecycleApp.addTrip('a')
    thecycleApp.addTrip('b')
    thecycleApp.addTrip('c')
    thecycleApp.removeTrip('b')
    it('should remove that Trip', function () {
      const expectedTripdestinations = ['a', 'c']
      const actualTripdestinations = getdestinations(thecycleApp.allMytrips)
      expect(actualTripdestinations).toEqual(expectedTripdestinations)
    })

    it('should reduce the Trip count', function () {
      const expectedRemainingCount = 2
      const actualRemainingCount = thecycleApp.allMytrips.length
      expect(actualRemainingCount).toBe(expectedRemainingCount)
    })
  })

  describe('removing all completed trips', function () {
    var thecycleApp = new cycleApp()
    thecycleApp.addTrip('a')
    thecycleApp.addTrip('b')
    thecycleApp.addTrip('c')
    thecycleApp.addTrip('d')
    thecycleApp.allMytrips[1].completed = true
    thecycleApp.allMytrips[2].completed = true
    thecycleApp.removeCompleted()
    it('should remove all of the completed trips', function () {
      const expectedTripdestinations = ['a', 'd']
      const actualTripdestinations = getdestinations(thecycleApp.allMytrips)
      expect(actualTripdestinations).toEqual(expectedTripdestinations)
    })

    it('should reduce the Trip count', function () {
      const expectedRemainingCount = 2
      const actualRemainingCount = thecycleApp.allMytrips.length
      expect(actualRemainingCount).toBe(expectedRemainingCount)
    })
  })

  // FEATURE 8. Update/edit a trips
  describe('editing a Trip', function () {
    var thecycleApp = new cycleApp()
    thecycleApp.addTrip('a')
    thecycleApp.addTrip('b')
    thecycleApp.addTrip('c')
    thecycleApp.startEditing(thecycleApp.allMytrips[1])
    thecycleApp.allMytrips[1].destination = 'bb'
    thecycleApp.doneEditing(thecycleApp.allMytrips[1])
    it('should change the destination of that Trip', function () {
      expect(thecycleApp.allMytrips[1].destination).toBe('bb')
    })
  })

  // FEATURE 9. Discard /revert edits to a trips
  describe('discarding edits to a Trip', function () {
    it('should not change the destination of that Trip', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('a')
      thecycleApp.addTrip('b')
      thecycleApp.addTrip('c')
      thecycleApp.startEditing(thecycleApp.allMytrips[1])
      thecycleApp.allMytrips[1].destination = 'bb'
      thecycleApp.cancelEditing(thecycleApp.allMytrips[1])
      expect(thecycleApp.allMytrips[1].destination).toBe('b')
    })
  })

  // FEATURE 10. Validate inputs
  describe('validating inputs to a Trip', function () {
    it('should not allow empty destinations', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('a')
      thecycleApp.addTrip('')
      thecycleApp.addTrip('  ')
      thecycleApp.addTrip('b')
      const expectedTripdestinations = ['a', 'b']
      const actualTripdestinations = getdestinations(thecycleApp.allMytrips)
      expect(actualTripdestinations).toEqual(expectedTripdestinations)
    })
  })

  // FEATURE 11. A calculation within a trips
  // NOT IMPLEMENTED!, therefore NOT TESTED!
  describe('a ??? calculation within a trips', function () {
    it('should do the ???? calculation correctly', function () {
      expect(true).toBeTrue()
    })
  })
  
  // FEATURE 12. A calculation across many trips
  describe('working out if all trips are done', function () {
    it('should return true for an empty list', function () {
      var thecycleApp = new cycleApp()
      expect(thecycleApp.getAllDone()).toBeTrue()
    })

    it('should return false for a list with active trips in it', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('a')
      thecycleApp.addTrip('b')
      expect(thecycleApp.getAllDone()).toBeFalse()
    })

    it('should return true for a list with only completed trips in it', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('a')
      thecycleApp.addTrip('b')
      thecycleApp.allMytrips[0].completed = true
      thecycleApp.allMytrips[1].completed = true
      expect(thecycleApp.getAllDone()).toBeTrue()
    })
  })

  describe('counting active trips', function () {
    it('should return the correct number of remaining trips as trips are added or completed', function () {
      var thecycleApp = new cycleApp()
      expect(thecycleApp.remaining()).toBe(0)
      thecycleApp.addTrip('a')
      expect(thecycleApp.remaining()).toBe(1)
      thecycleApp.addTrip('b')
      expect(thecycleApp.remaining()).toBe(2)
      thecycleApp.addTrip('c')
      expect(thecycleApp.remaining()).toBe(3)
      thecycleApp.allMytrips[1].completed = true
      expect(thecycleApp.remaining()).toBe(2)
    })
  })

  // FEATURE 13. Provide default values
  describe('the default value for new trips', function () {
    it('should allocate a sequentially incrementing id to all new trips', function () {
      var thecycleApp = new cycleApp()
      for (let expectedId = 1; expectedId < 5; expectedId += 1) {
        thecycleApp.addTrip('another Trip')
        var actualId = thecycleApp.allMytrips[thecycleApp.allMytrips.length - 1].id
        expect(actualId).toBe(expectedId)
      }
    })

    it('should make all new trips not completed', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('a')
      const actualCompleted = thecycleApp.allMytrips[0].completed
      expect(actualCompleted).toBeFalse()
    })
  })

  // FEATURE 14. Find a trips given a search criterion
  describe('finding a Trip', function () {
    it('should find nothing with an empty trip', function () {
      var thecycleApp = new cycleApp()
      const actualFoundTrip = thecycleApp.findTrip('a')
      expect(actualFoundTrip).toBeUndefined()
    })

    it('should find the only Trip with a destination when that destination is unique', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('a')
      thecycleApp.addTrip('b')
      thecycleApp.addTrip('c')
      const actualFoundTrip = thecycleApp.findTrip('b')
      expect(actualFoundTrip).toBeDefined()
      const expectedFounddestination = 'b'
      const actualFounddestination = actualFoundTrip.destination
      expect(actualFounddestination).toBe(expectedFounddestination)
    })

    it('should find the first Trip with that destination when there is more than one Trip with the same destination', function () {
      var thecycleApp = new cycleApp()
      thecycleApp.addTrip('a')
      thecycleApp.addTrip('b')
      thecycleApp.addTrip('b')
      thecycleApp.addTrip('c')
      const actualFoundTrip = thecycleApp.findTrip('b')
      expect(actualFoundTrip).toBeDefined()
      const expectedFounddestination = 'b'
      const actualFounddestination = actualFoundTrip.destination
      expect(actualFounddestination).toBe(expectedFounddestination)
      const expectedFoundId = 2
      const actualFoundId = actualFoundTrip.id
      expect(actualFoundId).toBe(expectedFoundId)
    })
  })
})
