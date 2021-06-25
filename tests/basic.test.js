import test from "ava";
import { createActorSystem } from "@little-bonsai/ingrates";

import createLogEnhancer from "../src/index.js";

test.beforeEach((t) => {
	t.context.mockConsoleCalls = [];

	t.context.mockConsole = {
		debug: (...args) => t.context.mockConsoleCalls.push(["debug", ...args]),
		error: (...args) => t.context.mockConsoleCalls.push(["error", ...args]),
		info: (...args) => t.context.mockConsoleCalls.push(["info", ...args]),
		log: (...args) => t.context.mockConsoleCalls.push(["log", ...args]),
		warn: (...args) => t.context.mockConsoleCalls.push(["warn", ...args]),
	};

	t.context.system = createActorSystem({
		enhancers: [createLogEnhancer("testPrefix", t.context.mockConsole)],
	});
});

function testLogCall(t, getter, expectedCall) {
	t.plan(3);

	return new Promise((done) => {
		function TestActor({ log, msg, self }) {
			if (msg.type === "RUN_TEST") {
				getter(log)("foo");
				getter(log)("bar");
				getter(log)(1, 2, 3);

				t.deepEqual(t.context.mockConsoleCalls[0], [
					expectedCall,
					"testPrefix",
					self,
					"TestActor",
					"foo",
				]);

				t.deepEqual(t.context.mockConsoleCalls[1], [
					expectedCall,
					"testPrefix",
					self,
					"TestActor",
					"bar",
				]);

				t.deepEqual(t.context.mockConsoleCalls[2], [
					expectedCall,
					"testPrefix",
					self,
					"TestActor",
					1,
					2,
					3,
				]);

				done();
			}
		}

		t.context.system.register(TestActor);
		const addr = t.context.system.spawn.tester(TestActor);
		t.context.system.dispatch(addr, {
			type: "RUN_TEST",
		});
	});
}

test("can call log()", testLogCall, (log) => log, "log");
test("can call log.debug()", testLogCall, ({ debug }) => debug, "debug");
test("can call log.error()", testLogCall, ({ error }) => error, "error");
test("can call log.info()", testLogCall, ({ info }) => info, "info");
test("can call log.warn()", testLogCall, ({ warn }) => warn, "warn");
