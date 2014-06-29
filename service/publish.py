#!/usr/bin/python

import sys, getopt, os, shutil, distutils.dir_util

clientDir = 'client'
jsDir = 'js'
sharedDir = 'shared'
linkReplace = ('../../%s/' % sharedDir, './%s/' % sharedDir)

def showHelp(error = ''):
    if error != '':
        print error;
    print 'Usage: publish.py [OPTIONS] [TYPE] [DESTINATION]'
    print '  -h, --help     Show this message'
    print '  -o, --clean    Clear DESTINATION before publishing'
    print ''
    print 'TYPE specifies either the client (-c or --client) or the server (-s --server)'
    print 'DESTINATION must be a valid directory'
    sys.exit(2)


def publish(type, destination):
    print 'Publishing %s to %s' % (type, destination)
    if type == 'client':
        publishClient(destination)
    elif type == 'server':
        publishServer(destination)


def publishClient(destination):
    serviceDir = os.path.dirname(os.path.realpath(__file__))
    rootDir = os.path.abspath(os.path.join(serviceDir, os.path.pardir))

    clientPath = os.path.join(rootDir, clientDir)
    distutils.dir_util.copy_tree(clientPath, destination)

    sharedPath = os.path.join(rootDir, sharedDir)
    newSharedPath = os.path.join(destination, jsDir, sharedDir)
    distutils.dir_util.copy_tree(sharedPath, newSharedPath)

    relinkDir(destination);


def relinkDir(location):
    # fixes bug with nested if's
    if os.path.isfile(location):
        return

    for node in os.listdir(location):
        path = os.path.join(location, node)
        if (os.path.isfile(path)):
            name, extension = os.path.splitext(node)
            if extension == '.js':
                relinkFile(path)
        else:
            relinkDir(path)

def relinkFile(filename):
    tempFilename = os.path.splitext(filename)[0] + '.tmp'
    oldFile = open(filename)
    newFile = open(tempFilename, 'w')
    for oldLine in oldFile:
        newLine = oldLine.replace(linkReplace[0], linkReplace[1]);
        newFile.write(newLine)
    oldFile.close();
    newFile.close();
    os.remove(filename)
    os.rename(tempFilename, filename)


def main(argv):
    type = ''
    clean = False
    try:
        opts, args = getopt.getopt(argv, 'hcso:', ['help', 'client', 'server', 'clean']) 
    except getopt.GetoptError:
        showHelp('Invalid option specified')
    for opt, arg in opts:
        if opt in ('-h', '--help'):
            showHelp()
        elif opt in ('-f', '--force'):
            force = True
        elif opt in ('-c', '--client'):
            if type != '':
                showHelp('Cannot set TYPE twice')
            type = 'client'
        elif opt in ('-s', '--server'):
            if type != '':
                showHelp('Cannot set TYPE twice')
            type = 'server'
        elif opt in ('-o', '--clean'):
            clean = True
    destination = os.path.abspath(sys.argv[len(sys.argv)-1])

    if type == '':
        showHelp('TYPE not specified')

    if clean and os.path.exists(destination):
        shutil.rmtree(destination)

    publish(type, destination)


if __name__ == '__main__':
    main(sys.argv[1:])
