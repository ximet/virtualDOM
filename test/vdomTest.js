import { VirtualNode, createVirtualNode, createTextVirtualNode, createEmptyVirtualNode, clonedVirtualNode, clonedVirtualNodes } from '../src/vdom/vdom.js';
import jsdom  from "mocha-jsdom";
import expect from 'expect';

/** @jsx createVirtualNode */
describe('Test VDOM', () => {
    jsdom();

    describe('Check createVirtualNode', () => {
        it('test function check createVirtualNode', () => {
            const type = 'node';
            const vnode = new createVirtualNode(type);

            expect(createVirtualNode(type)).toEqual(vnode);
            expect(createVirtualNode(type, {})).toEqual(vnode);
            expect(createVirtualNode(type, '')).toEqual(vnode);
            expect(createVirtualNode(type, 'props')).toNotEqual(vnode);
            expect(createVirtualNode(type, {attr: 'checked'})).toNotEqual(vnode);
        });
    });

    describe('Check Virtual Text Node', () => {
        it('test function check createTextVirtualNode', () => {
            const param = 'testNode';
            const vnode = new VirtualNode();
            vnode.text = param;

            expect(createTextVirtualNode(param)).toEqual(vnode);
        });
    });

    describe('Check Virtual Empty node from create text VM', () => {
        it('test function check createTextVirtualNode if empty node', () => {
            const vnode = new VirtualNode();

            expect(createTextVirtualNode()).toEqual(vnode);
        });
    });

    describe('Check Virtual Empty node', () => {
        it('test function check createEmptyVirtualNode', () => {
            const vnode = new VirtualNode();

            expect(createEmptyVirtualNode()).toEqual(vnode);
        });
    });

    describe('Check cloneVN', () => {
        it('test function check clonedVirtualNode', () => {
            const vnode = new VirtualNode();
            const clone = clonedVirtualNode(vnode);

            expect(clone.isCloned).toEqual(true);
            expect(clone.tag).toEqual(vnode.tag);
        });
    });

    describe('Check array clonedVN', () => {
        it('test function check clonedVirtualNodes', () => {
            const tag = 'div';
            const vnode1 = new VirtualNode();
            const vnode2 = new VirtualNode(tag);
            const clone = clonedVirtualNodes([vnode1, vnode2]);

            expect(clone[0].isCloned).toEqual(true);
            expect(clone[0].tag).toEqual(vnode1.tag);
            expect(clone[1].tag).toEqual(vnode2.tag);
            expect(clone[1].tag).toEqual(tag);
        });
    });
});
