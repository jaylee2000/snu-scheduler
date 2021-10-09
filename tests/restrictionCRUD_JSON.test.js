const request = require("supertest");
const app = require("../src/app");
const { Restriction } = require("../src/models/restriction");

const restrictionA_input = {
    restrictionName: "A",
    mon: "2-4",
    tue: "",
};

const restrictionA_stored = {
    restrictionName: "A",
    mon: [[2, 4]],
    tue: [],
    wed: [],
    thur: [],
    fri: [],
};

beforeEach(async () => {
    await request(app)
        .post("/restriction")
        .send(restrictionA_input)
        .expect(302); // redirect
});

test("Create a restriction and find it", async () => {
    const theRestriction = await Restriction.find(restrictionA_stored);
    expect(theRestriction).not.toEqual(undefined);
});

test("Read all restrictions", async () => {
    const restrictionB_input = {
        restrictionName: "B",
        mon: "2-4, 11-16, 17-23",
        tue: "4-5",
        wed: "",
    };

    await request(app)
        .post("/restriction")
        .send(restrictionB_input)
        .expect(302); // redirect

    const allRestrictions = await Restriction.find({});
    expect(allRestrictions.length).toBe(2);

    await request(app).get("/restriction").expect(200);
});

test("Update a restriction", async () => {
    const A = await Restriction.findOne(restrictionA_stored);
    const updateDetails = {
        restrictionName: "A",
        mon: "   ...// ",
        tue: "6-11, 13-17",
    };

    const updateDetailsStored = {
        restrictionName: "A",
        mon: [],
        tue: [
            [6, 11],
            [13, 17],
        ],
        wed: [],
        thur: [],
        fri: [],
    };

    await request(app)
        .patch(`/restriction/${A._id}`)
        .send(updateDetails)
        .expect(302); // redirect

    const updatedRestrictionFail = await Restriction.find(restrictionA_stored);
    expect(updatedRestrictionFail.length).toBe(0);

    const updatedRestrictionSuccess = await Restriction.find(
        updateDetailsStored
    );
    expect(updatedRestrictionSuccess).not.toEqual(undefined);
});

test("Delete a restriction", async () => {
    const A = await Restriction.findOne(restrictionA_stored);
    await request(app).delete(`/restriction/${A._id}`).expect(302); // redirect
    const allRestrictions = await Restriction.find({});
    expect(allRestrictions.length).toBe(0);
});

afterEach(async () => {
    await Restriction.deleteMany({});
});
